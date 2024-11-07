namespace CasaAPI.Interfaces
{
    public interface IDevice
    {
        public int id { get; set; }
        public int pin { get; set; }
        public bool state { get; set; }
        public double voltage { get; set; } // Volts
        public double amperes { get; set; } // Amperes
    }
}
