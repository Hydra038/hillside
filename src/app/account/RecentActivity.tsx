"use client";

import { useEffect, useState } from "react";

type Activity = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await fetch("/api/account/activity");
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-8">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      {loading ? (
        <div className="animate-pulse h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
      ) : activities.length === 0 ? (
        <div className="text-gray-500">No recent activity.</div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {activities.map(act => (
            <li key={act.id} className="py-2 flex justify-between items-center">
              <span>{act.description}</span>
              <span className="text-xs text-gray-400">{new Date(act.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
