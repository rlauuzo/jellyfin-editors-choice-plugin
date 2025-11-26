using System.Reflection;
using System.Runtime.Loader;
using Newtonsoft.Json.Linq;
using EditorsChoicePlugin.Helpers;
using Microsoft.Extensions.Hosting;
using MediaBrowser.Common.Plugins;

namespace EditorsChoicePlugin.Services;
public class StartupService(IPluginManager pluginManager) : IHostedService
{
    private readonly IPluginManager _pluginManager = pluginManager;

    public Task StartAsync(CancellationToken cancellationToken)
    {
        if (!_pluginManager
            .Plugins
            .Any(p => p.Id == Guid.Parse("5e87cc92-571a-4d8d-8d98-d2d4147f9f90")))
        {
            return Task.CompletedTask;
        }

        Plugin.Instance!.FileTransformationPluginEnabled = true;

        JObject payload = new JObject
        {
            { "id", "b3d45a0e-3dac-4413-97df-32a13316571e" },
            { "fileNamePattern", "index.html" },
            { "callbackAssembly", GetType().Assembly.FullName },
            { "callbackClass", typeof(Transformations).FullName },
            { "callbackMethod", nameof(Transformations.IndexTransformation) }
        };

        Assembly? fileTransformationAssembly =
            AssemblyLoadContext.All.SelectMany(x => x.Assemblies).FirstOrDefault(x =>
                x.FullName?.Contains(".FileTransformation", StringComparison.Ordinal) ?? false);

        if (fileTransformationAssembly is not null)
        {
            Type? pluginInterfaceType = fileTransformationAssembly.GetType("Jellyfin.Plugin.FileTransformation.PluginInterface");

            pluginInterfaceType?.GetMethod("RegisterTransformation")?.Invoke(null, [payload]);
        }

        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
