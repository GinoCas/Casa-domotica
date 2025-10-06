using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.InterfaceAdapter.Presenters.Models;

namespace CasaBackend.Casa.InterfaceAdapter.Presenters
{
    public class AutomationPresenter : IPresenter<AutomationEntity, AutomationViewModel>
    {
        public AutomationViewModel Present(AutomationEntity entity)
        {
            return new AutomationViewModel
            {
                Id = entity.Id,
                State = entity.State,
                StateText = entity.State ? "Encendido" : "Apagado",
                Name = entity.Name,
                Description = entity.Description,
                InitTime = entity.InitTime.ToString(),
                EndTime = entity.EndTime.ToString(),
                Devices = entity.Devices.Select(ad => new AutomationDeviceViewModel
                {
                    Id = ad.DeviceId,
                    AutoState = ad.State,
                }).ToList()
            };
        }
    }
}