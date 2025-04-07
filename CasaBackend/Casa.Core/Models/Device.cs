namespace CasaBackend.Casa.Core.Models
{
    public class Device
    {
        public int Id { get; set; }
        public int Pin { get; set; }
        public bool State { get; set; }

        public void TurnOn()
        {
            State = true;
        }
        public void TurnOff()
        {
            State = false;
        }
    }
}
