import React, { useState, useEffect } from "react"
import { Tags } from "components/station/station.type"

export const MarkerPopUp = ({
  station_code,
  network,
  tags,
  longitude,
  latitude,
  archived,
  last_observation,
}: {
  station_code: string | null;
  network: string[] | null;
  tags: Tags | undefined;
  longitude: string;
  latitude: string;
  archived: boolean | null;
  last_observation: string | null;
}) => {
  const networks = (network as string[]).map((item) => (
    <tr key={item}>
      <td>{item}</td>
    </tr>
  ))

  // TODO Need to optimize the below html element.
  return (
    <div>
      <table>
        <tr>
          <td>
            <b>station code:</b>
          </td>
          <td>{station_code}</td>
        </tr>
        <tr>
          <td>
            <b>networks:</b>
          </td>
          <td>
            <table>{networks}</table>
          </td>
        </tr>
        <tr>
          <td>
            <b>tags:</b>
          </td>
          {tags ? (
            <td>
              <table>
                {Object.entries(tags).map(([field, value], index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <b>{field}:</b>
                      </td>
                      <td>{value}</td>
                    </tr>
                  )
                })}
              </table>
            </td>
          ) : (
            <td></td>
          )}
        </tr>
        <tr>
          <td>
            <b>longitude:</b>
          </td>
          <td>{longitude}</td>
        </tr>
        <tr>
          <td>
            <b>latitude:</b>
          </td>
          <td>{latitude}</td>
        </tr>
        <tr>
          <td>
            <b>archived: </b>
          </td>
          <td>{archived}</td>
        </tr>
        <tr>
          <td>
            <b>latest ob:</b>
          </td>
          <td>
            {new Date(last_observation as string).toLocaleDateString("en-US", {
              timeZone: "UTC",
            })}
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            {new Date(last_observation as string).toLocaleTimeString("en-US", {
              timeZone: "UTC",
            })}
          </td>
        </tr>
      </table>
    </div>
  )
}
