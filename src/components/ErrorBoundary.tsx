type Props = {
  error: {
    error: Error;
    componentStack: string;
    eventId: string;
    resetError(): void;
  };
};

function handleDynamicImportError(_: Error) {
  // Get the last reload time from local storage and the current time
  const timeStr = sessionStorage.getItem('last-reload');
  const time = timeStr ? Number(timeStr) : null;
  const now = Date.now();

  // If the last reload time is more than 10 seconds ago, reload the page
  const isReloading = !time || time + 10_000 < now;
  if (isReloading) {
    console.info('New version for this module found. Reloading ...');
    sessionStorage.setItem('last-reload', String(now));
    window.location.reload();

    return true;
  }

  // We let ErrorBoundary handle the error
  return false;
}

export const ErrorBoundary = ({ error: { error } }: Props) => {
  const handled = handleDynamicImportError(error);

  return handled ? null : (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <h1>Oops! Something went wrong.</h1>
      <p>
        Please try to <a href="/">reload the page</a> or come back later.
      </p>
    </div>
  );
};
