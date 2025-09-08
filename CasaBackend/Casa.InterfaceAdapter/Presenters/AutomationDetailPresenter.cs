using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Core.Entities;

namespace CasaBackend.Casa.InterfaceAdapter.Presenters
{
    public class AutomationDetailPresenter : IPresenter<AutomationEntity, AutomationDetailViewModel>
    {
        public AutomationDetailViewModel Present(AutomationEntity entity)
        {
            return new AutomationDetailViewModel
            {
                Id = entity.Id,
                State = entity.State,
                StateText = entity.State ? "Encendido" : "Apagado",
                Name = entity.Name,
                Description = entity.Description,
                InitTime = "Inicio:" + entity.InitTime.ToString(),
                EndTime = "Final:" + entity.EndTime.ToString(),
                Devices = entity.Devices.Select(ad => new DeviceViewModel
                {
                    Id = ad.Device.Id,
                    DeviceType = ad.Device.DeviceType.ToString(),
                    Name = ad.Device.Name,
                    Description = ad.Device.Description,
                    State = ad.Device.State
                }).ToList()
            };
        }
    }
}