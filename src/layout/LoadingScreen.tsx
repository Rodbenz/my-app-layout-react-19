import Backdrop from "@mui/material/Backdrop";


interface LoadingScreen {
  loading: boolean;
}
export default function LoadingScreen({ loading }: LoadingScreen) {
  return (
    <div>
      <Backdrop
        sx={{
          color: "#fff",
          backgroundColor: "white",
          zIndex: (theme) => theme.zIndex.modal + 1,
        }}
        open={loading}
      >
        {/* <img
            src="http://trr-web.trrgroup.com/storage/INTRANET/PROD/Asset/LoadingGIF/loadingWhite.gif"
            className="dark-logo "
            alt="Metronic dark logo"
          /> */}
        <div className="w-96 h-72">
          <img
            src={`${
              import.meta.env.VITE_APP_TRR_API_URL_LOGO
            }/storage/INTRANET/PROD/Asset/LoadingGIF/loading_V2.gif`}
            className="light-logo"
            alt="Metronic light logo"
          />
        </div>
      </Backdrop>
    </div>
  );
}
