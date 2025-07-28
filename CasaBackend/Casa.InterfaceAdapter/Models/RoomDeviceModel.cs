using System.ComponentModel.DataAnnotations.Schema;

namespace CasaBackend.Casa.InterfaceAdapter.Models
{
    public class RoomDeviceModel
    {
        [Column("rode_id")]
        public int Id { get; set; }

        [Column("rode_roomId")]
        public int RoomId { get; set; }

        [Column("rode_deviceId")]
        public int DeviceId { get; set; }
    }
}
