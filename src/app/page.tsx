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
import { AlertCircle, InfoIcon, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredTimeSlots = timeSlots.filter((slot) =>
    slot.people.some(
      (person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.surname.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
            <AlertTitle className="font-bold">
              Slot Assignment Notice
            </AlertTitle>
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
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>People</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimeSlots.map((slot) => (
                  <TableRow key={slot.time}>
                    <TableCell>{slot.time}</TableCell>
                    <TableCell>
                      {slot.people.length > 0 ? (
                        <div>
                          {slot.people.map((person, index) => (
                            <div
                              key={index}
                              className={index > 0 ? "mt-2" : ""}
                            >
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
                      {slot.people.length >= 1 && (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800"
                        >
                          Filled ({slot.people.length})
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
