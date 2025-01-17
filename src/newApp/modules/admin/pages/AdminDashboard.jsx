

import React, { useState, useEffect } from "react";
import PeoplesIcon from "@rsuite/icons/Peoples";
import FunnelStepsIcon from "@rsuite/icons/FunnelSteps";
import { HStack, Progress, Stat, VStack } from "rsuite";
import ContributionList from "../components/dashboard/contributionList";
import newRequest from "../../../../utils/newRequest"; // Adjust the import path as needed
import { BASE_URL } from "../../../../config"; // Adjust the import path as needed

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    contributionsThisWeek: 0,
    contributionsToday: 0,
    totalusers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await newRequest.get(`${BASE_URL}admin/statistics`);
        console.log(response);
        const { contributionsThisWeek
          ,contributionsToday
         ,
          totalDocuments
          
           } = response.data;
        setStats({ contributionsThisWeek
          ,contributionsToday
         ,
         totalDocuments });
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to fetch statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>{error}</div>;

  return (
    <VStack spacing={20}>
      <div className="w-full flex flex-wrap gap-4">
        <Stat
          bordered
          className="col"
          icon={
            <PeoplesIcon
              className="text-primaryColor"
              style={{ fontSize: 30 }}
            />
          }
        >
          <Stat.Value>{stats.totalDocuments}</Stat.Value>
          <Stat.Label>documents Total enregistrés</Stat.Label>
        </Stat>

        <Stat
          bordered
          className="col"
          icon={
            <FunnelStepsIcon
              className="text-primaryColor"
              style={{ fontSize: 30 }}
            />
          }
        >
          <Stat.Value>{stats.contributionsThisWeek}</Stat.Value>
          <Stat.Label>Documents reçus cette semaine</Stat.Label>
        </Stat>
        <Stat bordered className="col">
          <HStack spacing={16}>
            <Progress.Circle
              percent={(stats.contributionsToday / stats.contributionsThisWeek) * 100}
              width={50}
              strokeWidth={10}
              trailWidth={10}
            />
            <VStack>
              <Stat.Value>{stats.contributionsToday}</Stat.Value>
           
              <Stat.Label>Documents reçus aujourd'hui</Stat.Label>
            </VStack>
          </HStack>
        </Stat>
      </div>
      <ContributionList />
    </VStack>
  );
};

