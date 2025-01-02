
import { SnackbarProvider, useSnackbar } from "notistack";
import { forwardRef, useImperativeHandle } from "react";

const SnackbarComponent = forwardRef((_, ref) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <Snackbar ref={ref} />
    </SnackbarProvider>
  );
});

export default SnackbarComponent;

const Snackbar = forwardRef((_, ref) => {
  const { enqueueSnackbar } = useSnackbar();

  function enqueueSnack(snackMessage, snackVariant) {
    enqueueSnackbar(snackMessage, { variant: snackVariant });
  }

  useImperativeHandle(ref, () => ({
    enqueueSnack
  }));

  return <></>;
})
