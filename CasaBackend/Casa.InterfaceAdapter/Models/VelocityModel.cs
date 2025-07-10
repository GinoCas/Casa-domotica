using System.ComponentModel.DataAnnotations.Schema;

namespace CasaBackend.Casa.InterfaceAdapter.Models
{
    public class VelocityModel
    {
        [Column("velo_id")]
        public int Id { get; set; }
        [Column("velo_deviceId")]
        public int DeviceId { get; set; }
        [Column("velo_speed")]
        public int Speed { get; set; }
    }
}
