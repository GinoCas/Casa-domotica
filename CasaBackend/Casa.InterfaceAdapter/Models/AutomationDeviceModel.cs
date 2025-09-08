using CasaBackend.Casa.InterfaceAdapter.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Casa.InterfaceAdapter.Models
{
    public class AutomationDeviceModel
    {
        [Column("aude_id")]
        public int Id { get; set; }

        [Column("aude_state")]
        public bool State { get; set; }

        [Column("aude_automationId")]
        public int AutomationId { get; set; }

        [Column("aude_deviceId")]
        public int DeviceId { get; set; }
    }
}