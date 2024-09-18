import { NextResponse } from 'next/server';
import Papa from 'papaparse';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1vqwzrBAHDM0xze2IvHDFchy5wq2cCwdGKSUztaxzu7Q/gviz/tq?tqx=out:csv&gid=2103911492";

type Person = {
  name: string;
  surname: string;
  phone: string;
};

type TimeSlot = {
  time: string;
  people: Person[];
};

export async function GET() {
  try {
    const response = await fetch(SHEET_URL, { cache: 'no-store' });
    const csvData = await response.text();
    
    const results = Papa.parse(csvData, { header: true });
    const data = results.data as any[];

    // Process data
    const timeSlots: { [key: string]: Person[] } = {};
    for (let hour = 0; hour < 24; hour++) {
      timeSlots[`${hour.toString().padStart(2, '0')}:00`] = [];
    }

    const formatTimeSlot = (timeStr: string) => {
      if (!timeStr || typeof timeStr !== 'string') {
        console.warn(`Invalid time string: ${timeStr}`);
        return '00:00'; // Default to midnight if invalid
      }

      const [time, period] = timeStr.trim().split(' ');
      if (!time || !period) {
        console.warn(`Invalid time format: ${timeStr}`);
        return '00:00'; // Default to midnight if invalid
      }

      let [hour, minute] = time.split(':').map(Number);
      if (isNaN(hour) || isNaN(minute)) {
        console.warn(`Invalid time format: ${timeStr}`);
        return '00:00'; // Default to midnight if invalid
      }

      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      return `${hour.toString().padStart(2, '0')}:00`;
    };

    const assignPerson = (person: Person, preferences: string[]) => {
      // Try to assign to an empty preferred slot
      for (const pref of preferences) {
        if (timeSlots[pref] && timeSlots[pref].length === 0) {
          timeSlots[pref].push(person);
          return;
        }
      }

      // Try to assign to a preferred slot with only one person
      for (const pref of preferences) {
        if (timeSlots[pref] && timeSlots[pref].length === 1) {
          timeSlots[pref].push(person);
          return;
        }
      }

      // Try to assign to any open slot
      for (const slot in timeSlots) {
        if (timeSlots[slot].length === 0) {
          timeSlots[slot].push(person);
          return;
        }
      }

      // If no open slots, assign to preferred slot with the least people
      let leastPopulatedSlot = preferences[0];
      for (const pref of preferences) {
        if (timeSlots[pref].length < timeSlots[leastPopulatedSlot].length) {
          leastPopulatedSlot = pref;
        }
      }
      timeSlots[leastPopulatedSlot].push(person);
    };

    for (const row of data) {
      const person: Person = {
        name: row['Name'] || '',
        surname: row['Surname'] || '',
        phone: row['WhatsApp Number'] ? '+27' + row['WhatsApp Number'].replace(/\D/g, '').slice(1) : '',
      };
      const preferences = [
        formatTimeSlot(row['Preferred Time Slot']),
        formatTimeSlot(row['Second Preferred Time Slot']),
        formatTimeSlot(row['Last Preferred Time Slot']),
      ];
      assignPerson(person, preferences);
    }

    const formattedTimeSlots: TimeSlot[] = Object.entries(timeSlots).map(([time, people]) => ({
      time,
      people,
    }));

    return NextResponse.json(formattedTimeSlots, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    return NextResponse.json({ error: 'Failed to fetch or process data' }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Pragma': 'no-cache',
      },
    });
  }
}