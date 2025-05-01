import React, { useState, useEffect } from "react";
import { Card, CardContent } from '../components/ui/card';
import { Loader2, Files ,Calendar ,Clock } from 'lucide-react';
import { VStack } from "rsuite";
import ContributionList from "../components/dashboard/contributionList";
import newRequest from "../../../../utils/newRequest";
import { BASE_URL } from "../../../../config";
 import ElectionDocuments from '../components/dashboard/election_documtns';

const StatCard = ({ value, icon: Icon, description }) => (
  <Card className="w-full md:w-[calc(33.33%-1rem)]">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        {Icon && (
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
        <div className="text-2xl font-bold">{value}</div>
      </div>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    contributionsThisWeek: 0,
    contributionsToday: 0,
    totalDocuments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await newRequest.get(`${BASE_URL}admin/statistics`);
        const {
          contributionsThisWeek,
          contributionsToday,
          totalDocuments
        } = response.data;
        setStats({
          contributionsThisWeek,
          contributionsToday,
          totalDocuments
        });
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to fetch statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/15 p-4 text-destructive">
        {error}
      </div>
    );
  }

  return (
    <VStack spacing={20}>
      <div className="w-full flex flex-wrap gap-4">
        <StatCard
          value={stats.totalDocuments.toLocaleString()}
          description="Total documents registered"
          icon={Files}
        />
        <StatCard
          value={stats.contributionsThisWeek.toLocaleString()}
          description="Documents received this week"
          icon={Calendar}
        />
        <StatCard
          value={stats.contributionsToday.toLocaleString()}
          description="Documents received today"
          icon={Clock}
        />
      </div>
      <ContributionList />
      <ElectionDocuments/>
    </VStack>
  );
};

export default AdminDashboard;