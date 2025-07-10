using AutoMapper;
using CasaBackend.Casa.Core.Entities;
using CasaBackend.Casa.Core.Entities.Capabilities;
using CasaBackend.Casa.InterfaceAdapter.DTOs;
using CasaBackend.Casa.InterfaceAdapter.Models;
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

            //Capabilities
            CreateMap<DimmableModel, DimmableEntity>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Brightness, opt => opt.MapFrom(src => src.Brightness))
                .ReverseMap();
            CreateMap<VelocityModel, VelocityEntity>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Speed, opt => opt.MapFrom(src => src.Speed))
                .ReverseMap();

            //Presentation
            CreateMap<DeviceViewModel, DeviceEntity>();
            CreateMap<LedEntity, LedViewModel>()
                .ForMember(dest => dest.Brightness, opt => opt.MapFrom(src => src.Dimmable.Brightness));
            CreateMap<FanEntity, FanViewModel>()
                .ForMember(dest => dest.Speed, opt => opt.MapFrom(src => src.Velocity.Speed));
        }
    }
}
