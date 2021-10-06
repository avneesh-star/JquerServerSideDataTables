using System.Threading.Tasks;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _Cloudinary;
        public PhotoService(IOptions<CloudinarySettings> config)
        {
            // ordering is important
            var acc = new Account
            (
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            _Cloudinary = new Cloudinary(acc);
        }

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();
            if(file.Length > 0)
            {
                using var stream = file.OpenReadStream();
                var uploadparams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
                   
                };
                uploadResult = await _Cloudinary.UploadAsync(uploadparams);
            }
             return uploadResult;
        }

        public async Task<DeletionResult> deletePhotoAsync(string publicId)
        {
            var deletaparams = new DeletionParams(publicId);
            var result = await _Cloudinary.DestroyAsync(deletaparams);
            return result;
        }
    }
}