using AutoMapper;
using Casa.InterfaceAdapter.Models;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Models;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;
using CasaBackend.Casa.InterfaceAdapter.Presenters;
namespace CasaBackend.Casa.InterfaceAdapter.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //DTO
            CreateMap<DeviceEntity, DeviceDto>();
            CreateMap<CommandDto, CommandEntity>();

            CreateMap<DeviceEntity, DeviceModel>()
                .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(src => src.DeviceType.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.DeviceType, opt => opt.Ignore());

            //Capabilities
            CreateMap<DimmableModel, DimmableEntity>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Brightness, opt => opt.MapFrom(src => src.Brightness))
                .ReverseMap();
            CreateMap<VelocityModel, VelocityEntity>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Speed, opt => opt.MapFrom(src => src.Speed))
                .ReverseMap();
            //Rooms
            CreateMap<RoomModel, RoomEntity>()
                .ForMember(dest => dest.DevicesId, opt => opt.MapFrom(src => 
                    src.RoomDevices.Select(rd => rd.DeviceId).ToList()));
            CreateMap<RoomEntity, RoomModel>()
                 .ForMember(dest => dest.RoomDevices, opt => opt.Ignore());

            //Presentation
            CreateMap<DeviceViewModel, DeviceEntity>();
            CreateMap<LedEntity, LedViewModel>()
                .ForMember(dest => dest.Brightness, opt => opt.MapFrom(src => src.Dimmable.Brightness));
            CreateMap<FanEntity, FanViewModel>()
                .ForMember(dest => dest.Speed, opt => opt.MapFrom(src => src.Velocity.Speed));

            //Automations
            CreateMap<AutomationDeviceModel, AutomationDeviceEntity>().ReverseMap();
            CreateMap<AutomationModel, AutomationEntity>()
                .ForMember(dest => dest.Devices, opt => opt.MapFrom(src => src.Devices))
                .ReverseMap();

            CreateMap<AutomationDto, AutomationEntity>()
                .ForMember(dest => dest.Devices, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AutomationDto, AutomationEntity>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
            CreateMap<AutomationEntity, AutomationViewModel>();
            CreateMap<AutomationDeviceDto, AutomationDeviceEntity>().ReverseMap();
        }
    }
}
