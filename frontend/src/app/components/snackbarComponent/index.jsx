import { forwardRef, useImperativeHandle } from "react";
import { SnackbarProvider, useSnackbar } from "notistack";

const SnackbarComponent = forwardRef((_, ref) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Snackbar ref={ref} />
    </SnackbarProvider>
  );
});
SnackbarComponent.displayName = "SnackbarComponent";

const Snackbar = forwardRef((_, ref) => {
  const { enqueueSnackbar } = useSnackbar();

  function enqueueSnack(snackMessage, snackVariant) {
    enqueueSnackbar(snackMessage, { variant: snackVariant });
  }

  useImperativeHandle(ref, () => ({
    enqueueSnack,
  }));

  // Returning null to indicate no renderable UI for this component
  return null;
});
Snackbar.displayName = "Snackbar";

export default SnackbarComponent;
