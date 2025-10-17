using System.ComponentModel.DataAnnotations.Schema;

namespace CasaBackend.Casa.InterfaceAdapter.Models
{
    public class ModeModel
    {
        [Column("mode_id")]
        public int Id { get; set; }

        [Column("mode_name")]
        public string Name { get; set; } = string.Empty;

        [Column("mode_state")]
        public bool State { get; set; }
    }
}