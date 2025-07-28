using System.ComponentModel.DataAnnotations.Schema;

namespace CasaBackend.Casa.InterfaceAdapter.Models
{
    public class RoomModel
    {
        [Column("room_id")]
        public int Id { get; set; }

        [Column("room_name")]
        public string Name { get; set; } = string.Empty;
        public ICollection<RoomDeviceModel> RoomDevices { get; set; } = new List<RoomDeviceModel>();
    }
}