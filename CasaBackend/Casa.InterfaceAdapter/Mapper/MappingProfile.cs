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
            CreateMap<DeviceEntity, DeviceDto>();
            CreateMap<CommandDto, CommandEntity>();
            CreateMap<DimmableModel, DimmableEntity>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Brightness, opt => opt.MapFrom(src => src.Brightness))
                .ReverseMap();
            CreateMap<DeviceViewModel, DeviceEntity>();
            CreateMap<LedEntity, LedViewModel>()
                .ForMember(dest => dest.Brightness, opt => opt.MapFrom(src => src.Dimmable.Brightness));
        }
    }
}
