import { Alert } from "@eco/stratos-components"
import { ReactElement } from "react";

export const DataNotification = ({
    banner_type,
    message,
}: {
    banner_type: string;
    message: string;
}): ReactElement => {
    let banner: ReactElement = <></>;

    if (banner_type === "success") {
        banner = (
            <Alert
                id="save-alert-success"
                testId="save-alert-success"
                variant="success"
                message={message}
                iconName="fa-sharp fa-regular fa-circle-check"
                dismissible={true}
                onDismiss={() => void 0}
            />
        );
    } else if (banner_type === "info") {
        banner = (
            <Alert
                id="save-alert-info"
                testId="save-alert-info"
                variant="info"
                message={message}
                iconName="fa-sharp fa-regular fa-circle-info"
                dismissible={true}
                onDismiss={() => void 0}
            />
        );
    } else if (banner_type === "error") {
        banner = (
            <Alert
                id="alert-error"
                testId="test-alert-error"
                variant="error"
                message={message}
                iconName="fa-sharp fa-regular fa-circle-exclamation"
                dismissible={true}
                onDismiss={() => void 0}
            />
        );
    } else {
        banner = (<></>)
    }
    return banner;
};
