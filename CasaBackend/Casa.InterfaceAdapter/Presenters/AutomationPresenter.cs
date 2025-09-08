using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Core.Entities;

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
                Name = entity.Name,
                Description = entity.Description,
                InitTime = "Inicio:" + entity.InitTime.ToString(),
                EndTime = "Final:" + entity.EndTime.ToString(),
            };
        }
    }
}