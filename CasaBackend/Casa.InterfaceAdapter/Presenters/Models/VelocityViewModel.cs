namespace CasaBackend.Casa.InterfaceAdapter.Presenters.Models
{
    public class VelocityViewModel : CapabilityViewModel
    {
        public int Speed { get; set; }
        public override string CapabilityType => "Velocity";
    }
}