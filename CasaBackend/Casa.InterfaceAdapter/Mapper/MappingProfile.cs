using AutoMapper;
using Casa.InterfaceAdapter.Models;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Models;
using CasaBackend.Casa.InterfaceAdapter.Models.Capabilities;
using CasaBackend.Casa.InterfaceAdapter.Presenters.Models;
namespace CasaBackend.Casa.InterfaceAdapter.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //DTO
            CreateMap<DeviceDto, DeviceEntity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            CreateMap<CommandDto, CommandEntity>();
            CreateMap<ArduinoDeviceDto, DeviceEntity>()
                .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(src => src.Type))
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State));

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

            CreateMap<ICapabilityModel, ICapabilityEntity>()
                .Include<DimmableModel, DimmableEntity>()
                .Include<VelocityModel, VelocityEntity>()
                .ReverseMap();

            CreateMap<ArduinoDeviceDto, DimmableEntity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Brightness, opt => opt.MapFrom(src => src.Brightness));

            CreateMap<ArduinoDeviceDto, VelocityEntity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Speed, opt => opt.MapFrom(src => src.Speed));

            //Rooms
            CreateMap<RoomModel, RoomEntity>()
                .ForMember(dest => dest.DevicesId, opt => opt.MapFrom(src => 
                    src.RoomDevices.Select(rd => rd.DeviceId).ToList()));
            CreateMap<RoomEntity, RoomModel>()
                 .ForMember(dest => dest.RoomDevices, opt => opt.Ignore());

            CreateMap<CreateRoomDto, RoomEntity>()
                .ForMember(dest => dest.DevicesId, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            //Presentation
            CreateMap<DeviceEntity, DeviceViewModel>()
                .ForMember(dest => dest.Capabilities, opt => opt.MapFrom(src => src.Capabilities));

            CreateMap<ICapabilityEntity, CapabilityViewModel>()
                .Include<DimmableEntity, DimmableViewModel>()
                .Include<VelocityEntity, VelocityViewModel>();

            CreateMap<DimmableEntity, DimmableViewModel>();
            CreateMap<VelocityEntity, VelocityViewModel>();

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
