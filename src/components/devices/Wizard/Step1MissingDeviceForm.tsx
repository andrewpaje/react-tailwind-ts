import React, { useContext, useEffect } from 'react'
import { Button, useWizard, Heading, Spinner } from "@eco/stratos-components"
import MissingDeviceTable from '../MissingDeviceTable/MissingDeviceTable'
import { useRouter } from "next/router";
import { MissingDeviceContext } from 'components/context/MissingDeviceContext';


export default function Step1Form() {
    const missingDeviceContext = useContext(MissingDeviceContext)
    const router = useRouter();

    const [{ currentStep }, { incrementCurrentStep, markCompleted }] = useWizard()

    const setActive = () => {
        markCompleted(currentStep);
        incrementCurrentStep();
    }

    useEffect(() => {

    }, [])

    return (
    <div>
        <div className='flex justify-between'>
            <Heading as="h3" size="md">
                Missing Devices
            </Heading>
            <div className='space-x-3.5'>
                <Button
                        id="btn-basic-default"
                        variant="default"
                        onClick={() => {router.push('/devices')}}
                    >
                    Cancel
                </Button>
                <Button
                        id="btn-basic-primary"
                        variant="primary"
                        onClick={(event) => setActive(event)}
                    >
                    Skip Step
                </Button>
            </div>

        </div>
        {/* <MissingDeviceTable missing_devices={missingDeviceContext?.setMissingDeviceRecords} /> */}
        { (missingDeviceContext?.missingDeviceRecords as Array).length > 1 ? (
            <MissingDeviceTable missing_devices={missingDeviceContext?.missingDeviceRecords} />
        ) : (
            <div className="place-content-center flex h-100 w-50 py-10">
                <Spinner mode="duotone" size="xxl" />
            </div>

        )}


    </div>
    )
}
