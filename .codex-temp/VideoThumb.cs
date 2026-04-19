using System;
using System.IO;
using System.Threading;
using Windows.Foundation;
using Windows.Storage;
using Windows.Storage.Streams;
using Windows.Media.Editing;
using Windows.Media.MediaProperties;

public static class VideoThumb
{
    private static T WaitFor<T>(IAsyncOperation<T> op)
    {
        while (op.Status == AsyncStatus.Started)
        {
            Thread.Sleep(10);
        }

        if (op.Status == AsyncStatus.Error)
        {
            throw op.ErrorCode;
        }

        return op.GetResults();
    }

    private static T WaitFor<T, TProgress>(IAsyncOperationWithProgress<T, TProgress> op)
    {
        while (op.Status == AsyncStatus.Started)
        {
            Thread.Sleep(10);
        }

        if (op.Status == AsyncStatus.Error)
        {
            throw op.ErrorCode;
        }

        return op.GetResults();
    }

    private static MediaClip LoadClip(string inputPath)
    {
        var file = WaitFor(StorageFile.GetFileFromPathAsync(inputPath));
        return WaitFor(MediaClip.CreateFromFileAsync((IStorageFile)file));
    }

    public static double GetDurationSeconds(string inputPath)
    {
        var clip = LoadClip(inputPath);
        return clip.OriginalDuration.TotalSeconds;
    }

    public static void SaveThumbnail(string inputPath, string outputPath, double seconds)
    {
        var clip = LoadClip(inputPath);
        var composition = new MediaComposition();
        composition.Clips.Add(clip);
        var imageStream = WaitFor(composition.GetThumbnailAsync(TimeSpan.FromSeconds(seconds), 0, 0, VideoFramePrecision.NearestFrame));
        var stream = (IRandomAccessStream)imageStream;
        var input = stream.GetInputStreamAt(0);
        var size = (uint)stream.Size;
        var reader = new DataReader(input);
        WaitFor(reader.LoadAsync(size));
        var bytes = new byte[size];
        reader.ReadBytes(bytes);
        File.WriteAllBytes(outputPath, bytes);
        reader.Dispose();
        input.Dispose();
        stream.Dispose();
    }
}
