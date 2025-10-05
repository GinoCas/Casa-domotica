using System.ComponentModel.DataAnnotations.Schema;

namespace CasaBackend.Casa.InterfaceAdapter.Models.Capabilities
{
    public class DimmableModel : ICapabilityModel
    {
        [Column("dimm_id")]
        public int Id { get; set; }
        [Column("dimm_deviceId")]
        public int DeviceId { get; set; }
        [Column("dimm_brightness")]
        public int Brightness { get; set; }
    }
}
