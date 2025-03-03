"use client";

import { useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import axios from "axios";

const prisma = new PrismaClient();

const AdminPanel = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/admin");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;

  return (
    <div className="p-8 ">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <Tabs defaultValue="citizens">
        <TabsList>
          {Object.keys(data).map((table) => (
            <TabsTrigger key={table} value={table}>{table}</TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(data).map((table) => (
          <TabsContent key={table} value={table}>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(data[table][0] || {}).map((column) => (
                        <TableHead key={column}>{column}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data[table].map((row: any, index: number) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, i) => (
                          <TableCell key={i}>{value.toString()}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminPanel;
