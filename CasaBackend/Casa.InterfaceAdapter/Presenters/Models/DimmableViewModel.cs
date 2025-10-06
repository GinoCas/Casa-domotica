namespace CasaBackend.Casa.InterfaceAdapter.Presenters.Models
{
    public class DimmableViewModel : CapabilityViewModel
    {
        public int Brightness { get; set; }
        public override string CapabilityType => "Velocity";
    }
}