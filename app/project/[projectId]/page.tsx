"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProjectTabs from "@/components/project/projectTabs";
import TabContent from "@/components/project/TabContent";
import Loader from "@/components/common/Loading";

export default function ProjectIdPage() {
  const { projectId }: any = useParams();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    if (projectId) loadProject();
  }, [projectId]);

  async function loadProject() {
    setLoading(true)
    const res = await fetch(`/api/project/${projectId}`);
    const data = await res.json();
    if (data.success) setProject(data.project);
    setLoading(false)
  }

  // console.log(project, "projestada", projectId);
  

  return (
      isLoading ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
            <Loader />
        </div>
      ) : (
          <div className="p-6">
      <ProjectTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className=" gap-6 mt-6">
        <div className="">
          <TabContent activeTab={activeTab} project={activeTab === "Overview" ? project : projectId} />
        </div>
      </div>
    </div>
      )
  );
}
