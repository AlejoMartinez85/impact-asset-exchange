import LiveMap from "@/components/LiveMap";

const MapPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Live Deployment Map</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Interactive view of all ELISA solar units worldwide</p>
      </div>
      <LiveMap />
    </div>
  );
};

export default MapPage;
