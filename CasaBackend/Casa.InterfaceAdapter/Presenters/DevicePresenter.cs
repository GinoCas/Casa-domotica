using AutoMapper;
using CasaBackend.Casa.Application.Interfaces.Presenter;
using CasaBackend.Casa.Core.Entities;

namespace CasaBackend.Casa.InterfaceAdapter.Presenters
{
    public class DevicePresenter(IMapper mapper) : IPresenter<DeviceEntity, DeviceViewModel>
    {
        private readonly IMapper _mapper = mapper;
        public DeviceViewModel Present(DeviceEntity entity)
        {
            return entity switch
            {
                LedEntity led => _mapper.Map<LedViewModel>(led),
                FanEntity fan => _mapper.Map<FanViewModel>(fan),
                _ => _mapper.Map<DeviceViewModel>(entity)
            };
        }
    }
}
