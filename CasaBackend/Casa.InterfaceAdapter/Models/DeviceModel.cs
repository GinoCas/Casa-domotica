using System.ComponentModel.DataAnnotations.Schema;

namespace CasaBackend.Casa.InterfaceAdapter.Models
{
    public class DeviceModel
    {
        [Column("devi_id")]
        public int Id { get; set; }
        [Column("devi_state")]
        public bool State { get; set; }
        [Column("devi_name")]
        public string Name { get; set; } = string.Empty;
        [Column("devi_description")]
        public string Description { get; set; } = string.Empty;
        [Column("devi_type")]
        public string DeviceType { get; set; } = string.Empty;
        [Column("devi_last_modified")]
        public DateTime LastModified { get; set; }
    }
}
