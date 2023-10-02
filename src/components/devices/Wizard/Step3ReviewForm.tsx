import React, { useContext, useEffect, useState } from 'react'
import { Button, useWizard, Heading, Card } from "@eco/stratos-components"
import { MissingDeviceContext } from 'components/context/MissingDeviceContext';
import { DataNotification } from 'components/notification/DataNotification';
import crypto from "crypto";
import { useRouter } from "next/router";

export interface RawDeviceProps {
    record_id: string;
    source_station_id: string;
    source_device_id: string;
    active: boolean;
    update_datetime: string;
    geolocation_id: string;
    dtn_station_id: string;
    last_updated_by: string;
    station_code: string;
    latitude: number;
    longitude: number;
    network: string;
    username: string;
}

export default function Step3ReviewForm() {
    const missingDeviceContext = useContext(MissingDeviceContext)
    const [bannerType, setBannerType] = useState<string>("hidden");
    const [bannerMessage, setBannerMessage] = useState<string>("");
    const router = useRouter();

    const [{ currentStep }, { incrementCurrentStep, markCompleted, decrementCurrentStep }] = useWizard()

    const ValidateRequiredField = (): boolean => {
        if (
            missingDeviceContext?.sourceDeviceId as string &&
            missingDeviceContext?.sourceStationId as string &&
            missingDeviceContext?.dataSourceId as string &&
            missingDeviceContext?.latitude as string &&
            missingDeviceContext?.longitude as string
        ) {
            return true;
        }
        return false;
    };

    const SaveNewDevice = async (): Promise<void> => {
        if (ValidateRequiredField()) {

            const record_id = crypto
                .createHash("sha256")
                .update(`${missingDeviceContext?.dataSourceId as string}${missingDeviceContext?.sourceStationId as string}${missingDeviceContext?.sourceDeviceId as string}`)
                .digest("hex");

            let existing_token = JSON.parse(localStorage.getItem('backend-token'))

            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${existing_token.data.access_token as string}`,
                },
                body: JSON.stringify({
                    data_source_id: missingDeviceContext?.dataSourceId,
                    device_id: missingDeviceContext?.sourceDeviceId,
                    station_id: missingDeviceContext?.sourceStationId,
                    latitude: missingDeviceContext?.latitude,
                    longitude: missingDeviceContext?.longitude,
                    elevation: missingDeviceContext?.elevation,
                }),
            };

            const response = await fetch(
                `${process.env.BACKEND_API_END_POINT as string}/api/v1/devices/${record_id}`,
                requestOptions,
            );
            const data = (await response.json()) as RawDeviceProps;

            if (data.record_id) {
                missingDeviceContext?.setSourceDeviceId("")
                missingDeviceContext?.setSourceStationId("")
                missingDeviceContext?.setDataSourceId("")
                missingDeviceContext?.setLatitude("")
                missingDeviceContext?.setLongitude("")
                missingDeviceContext?.setElevation("")
                setBannerMessage("New device added.");
                setBannerType("success");

            } else {
                setBannerMessage(
                    "Error encountered during saving, please try again.",
                );
                setBannerType("error");
            }
        } else {
            setBannerMessage("Warning, please fill all required fields.");
            setBannerType("info");
        }
    };

    useEffect(() => {
        if (bannerType !== "hidden") {
            setTimeout(() => {
                // After 4 seconds the banner will vanish
                if (bannerType === "success") {
                    router.push('/devices')
                }
                setBannerType("hidden");

            }, 1500);
        }
    }, [bannerType]);

    return (
    <div>
        <div className='pb-3'>
            <DataNotification banner_type={bannerType} message={bannerMessage} />
        </div>

        <div className='flex justify-between pb-4'>
            <Heading as="h3" size="md">
                Review and Save
            </Heading>
            <div className='space-x-3.5'>
                <Button
                        id="btn-basic-default"
                        variant="default"
                        onClick={() => decrementCurrentStep()}
                    >
                    Prev Step
                </Button>
                <Button
                        id="btn-basic-primary"
                        variant="primary"
                        onClick={(e) => {
                            e.preventDefault()
                            void SaveNewDevice()
                            incrementCurrentStep()}
                        }
                    >
                    Save
                </Button>
            </div>
        </div>
        <div className='pb-2'>
            <Card>
                <div className="px-4">
                    <span className='font-bold text-xl'>DEVICE DETAILS</span>
                    <div className='border-t p-3'>
                        <div className='font-normal text-base'>Device ID: {missingDeviceContext?.sourceDeviceId}</div>
                        <div className='font-normal text-base'>Station ID: {missingDeviceContext?.sourceStationId}</div>
                        <div className='font-normal text-base'>Network: {missingDeviceContext?.dataSourceId}</div>
                    </div>
                </div>
            </Card>
        </div>

        <Card>
            <div className="px-4">
                <span className='font-bold text-xl'>GEOLOCATION DETAILS</span>
                <div className='border-t p-3'>
                    <div className='font-normal text-base'>Latitude: {missingDeviceContext?.latitude}</div>
                    <div className='font-normal text-base'>Longitude: {missingDeviceContext?.longitude}</div>
                    <div className='font-normal text-base'>Elevation: {missingDeviceContext?.elevation}</div>
                </div>
            </div>
        </Card>
    </div>
    )
}