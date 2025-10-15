using Casa.InterfaceAdapter.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace CasaBackend.Casa.InterfaceAdapter.Models
{
    public class AutomationModel
    {
        [Column("auto_id")]
        public int Id { get; set; }
        [Column("auto_state")]
        public bool State { get; set; }
        [Column("auto_name")]
        public string Name { get; set; }
        [Column("auto_description")]
        public string Description { get; set; }

        [Column("auto_initTime")]
        public TimeSpan InitTime { get; set; }

        [Column("auto_endTime")]
        public TimeSpan EndTime { get; set; }

        [Column("auto_days")]
        public byte Days { get; set; }

        public ICollection<AutomationDeviceModel> Devices { get; set; } = new List<AutomationDeviceModel>();
    }
}