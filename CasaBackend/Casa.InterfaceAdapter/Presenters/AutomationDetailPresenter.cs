using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Core.Entities;

namespace CasaBackend.Casa.InterfaceAdapter.Presenters
{
    public class AutomationDetailPresenter : IPresenter<AutomationEntity, AutomationDetailViewModel>
    {
        public AutomationDetailViewModel Present(AutomationEntity entity)
        {
            var a = new AutomationDetailViewModel
            {
                Id = entity.Id,
                State = entity.State,
                StateText = entity.State ? "Encendido" : "Apagado",
                Name = entity.Name,
                Description = entity.Description,
                InitTime = "Inicio:" + entity.InitTime.ToString(),
                EndTime = "Final:" + entity.EndTime.ToString(),
                Devices = entity.Devices.Select(ad => new AutomationDeviceViewModel
                {
                    Id = ad.DeviceId,
                    AutoState = ad.State,
                }).ToList()
            };
            return a;
        }
    }
}