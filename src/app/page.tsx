"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronDown, ChevronUp, InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Person = {
  name: string;
  surname: string;
  phone: string;
};

type TimeSlot = {
  time: string;
  people: Person[];
};

export default function Home() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSlots, setExpandedSlots] = useState<Set<string>>(new Set());

  const fetchData = async () => {
    try {
      const response = await fetch("/api/fetchData", {
        cache: "no-store",
        headers: {
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setTimeSlots(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000); // Fetch every minute

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const toggleExpand = (time: string) => {
    setExpandedSlots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(time)) {
        newSet.delete(time);
      } else {
        newSet.add(time);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle className="font-bold">Slot Assignment Notice</AlertTitle>
            <AlertDescription>
              The priority is to keep the prayer chain unbroken by filling empty
              slots first. If you're not assigned to one of your preferred
              times, it means those slots were already filled, and we needed to
              ensure that all open slots were covered. Your flexibility helps us
              maintain continuous prayer throughout the day.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prayer Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>People</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((slot) => (
                <TableRow key={slot.time}>
                  <TableCell>{slot.time}</TableCell>
                  <TableCell>
                    {slot.people.length > 0 ? (
                      <div>
                        <div>{`${slot.people[0].name} ${slot.people[0].surname}`}</div>
                        <div className="text-sm text-gray-500">
                          {slot.people[0].phone}
                        </div>
                        {slot.people.length > 1 &&
                          !expandedSlots.has(slot.time) && (
                            <div className="text-sm text-gray-500 mt-1">
                              +{slot.people.length - 1} more
                            </div>
                          )}
                        {expandedSlots.has(slot.time) &&
                          slot.people.slice(1).map((person, index) => (
                            <div key={index} className="mt-2">
                              <div>{`${person.name} ${person.surname}`}</div>
                              <div className="text-sm text-gray-500">
                                {person.phone}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Empty</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {slot.people.length === 0 && (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800"
                      >
                        Empty
                      </Badge>
                    )}
                    {slot.people.length === 1 && (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        Partially Filled
                      </Badge>
                    )}
                    {slot.people.length >= 2 && (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        Filled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {slot.people.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(slot.time)}
                      >
                        {expandedSlots.has(slot.time) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
