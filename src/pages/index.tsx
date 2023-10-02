/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react";
import { PageShell, SingleColumnCentered } from "@eco/stratos-components";
import { NavBox, Details } from "components/navigation/NavBox";
import PageTemplate from "components/layout/PageTemplate";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";


export default withPageAuthRequired(function Home() {

  const pageDetails: Details[] = [
    {
      route_path: "/stations",
      title: "Stations",
      description: "View and edit stations and their metadata",
      image_path: "/station.png",
      enable: true
    },
    {
      route_path: "/devices",
      title: "Devices",
      description: "View and edit incoming devices",
      image_path: "/device.png",
      enable: true
    },
    {
      route_path: "/networks",
      title: "Networks",
      description: "View and edit stations and their metadata",
      image_path: "/networks.png",
      enable: false
    },
  ]


  return (
    <React.Fragment>
      <PageTemplate title="Home" header_only={true}>
        <PageShell>
          <SingleColumnCentered>
            <h1 className="my-2 text-xl font-bold">OneObs Station Manager</h1>
            <h2 className="my-4 text-l">Manage DTN's Observation platform</h2>
            <div className="grid grid-cols-3 gap-10">
              {
                pageDetails.map((page: Details) => {
                  return (
                    <NavBox key={page.title} details={page} />
                  )
                })
              }
            </div>
          </SingleColumnCentered>
        </PageShell>
      </PageTemplate>


    </React.Fragment>
  );
})