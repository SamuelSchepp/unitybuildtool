export class UnityBuildTool {

	// Use https://www.base64encode.org
	public static source = `
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.NetworkInformation;
using UnityEditor;
using UnityEngine;
using UnityEngine.WSA;
using Debug = UnityEngine.Debug;

namespace Editor
{
	public static class UnityBuildTool {

		private static Dictionary<string, BuildTargetGroup> TargetGroups = new Dictionary<string, BuildTargetGroup>() {
			{"ios", BuildTargetGroup.iOS},
			{"android", BuildTargetGroup.Android},
			{"windows", BuildTargetGroup.Standalone},
			{"mac", BuildTargetGroup.Standalone},
			{"webgl", BuildTargetGroup.WebGL}
		};

		private static Dictionary<string, BuildTarget> Targets = new Dictionary<string, BuildTarget>() {
			{"ios", BuildTarget.iOS},
			{"android", BuildTarget.Android},
			{"windows", BuildTarget.StandaloneWindows64},
			{"webgl", BuildTarget.WebGL},
			#if UNITY_2017_2 || UNITY_2017_1
			{"mac", BuildTarget.StandaloneOSXUniversal}
			#else
			{"mac", BuildTarget.StandaloneOSX}
			#endif
		};

		private static string[] GetScenePaths() {
			return EditorBuildSettings.scenes.Select((scene) => scene.path).ToArray();
		}

		private static void PerformBuild(string targetName, string artifactName, string platform, bool developmentBuild) {
			if (platform == "android") {
				artifactName = artifactName + ".apk";
			}
			if (platform == "windows") {
				artifactName = artifactName + ".exe";
			}
			
			var targetFolder = new System.IO.DirectoryInfo("build/" + targetName);
			
			var options = BuildOptions.None;
			if (developmentBuild) {
				options = options | BuildOptions.Development;
			}

			PlayerSettings.Android.keyaliasName = "";
			PlayerSettings.Android.keystoreName = "";

			EditorUserBuildSettings.development = developmentBuild;
			EditorUserBuildSettings.SwitchActiveBuildTarget(TargetGroups[platform], Targets[platform]);

			if (targetFolder.Exists) {
				Directory.Delete(targetFolder.FullName, true);
			}
		
			BuildPipeline.BuildPlayer(GetScenePaths(), targetFolder.FullName + "/" + artifactName, Targets[platform], options);
		}

		public static void Perform() {
			try {
				if (!TargetGroups.ContainsKey(ReadPlatform()) || !Targets.ContainsKey(ReadPlatform())) {
					throw new Exception("Platform " + ReadPlatform() + " not supported");
				}
				else {
					CreateSolution();
					PerformBuild(ReadTargetName(), ReadArtifactName(), ReadPlatform(), ReadDevelopmentBuild());
				}
			}
			catch (Exception ex) {
				Debug.LogException(ex);
				Console.WriteLine(ex.Message);
				EditorApplication.Exit(1);
			}
		}

		private static string ReadPlatform() {
			var args = Environment.GetCommandLineArgs();
			return args[args.Length - 1];
		}

		private static bool ReadDevelopmentBuild() {
			var args = Environment.GetCommandLineArgs();
			var devBuild = args[args.Length - 2];
			return devBuild.Equals("true");
		}

		private static string ReadArtifactName() {
			var args = Environment.GetCommandLineArgs();
			return args[args.Length - 3];
		}
		
		private static string ReadTargetName() {
			var args = Environment.GetCommandLineArgs();
			return args[args.Length - 4];
		}

		[MenuItem("UnityBuildTool/Build Mac", false, 101)]
		public static void BuildMac() {
			PerformBuild("fastbuild_mac", "artifact", "mac", true);
		}

		[MenuItem("UnityBuildTool/Build Windows", false, 101)]
		public static void BuildWindows() {
			PerformBuild("fastbuild_windows", "artifact", "windows", true);
		}

		[MenuItem("UnityBuildTool/Build WebGL", false, 101)]
		public static void BuildWebGL() {
			PerformBuild("fastbuild_webgl", "artifact", "webgl", true);
		}

		[MenuItem("UnityBuildTool/Build iOS", false, 101)]
		public static void BuildIOS() {
			PerformBuild("fastbuild_ios", "artifact", "ios", true);
		}

		[MenuItem("UnityBuildTool/Build Android", false, 101)]
		public static void BuildAndroid() {
			PerformBuild("fastbuild_android", "artifact", "android", true);
		}

		[MenuItem("UnityBuildTool/Clean", false, 1001)]
		public static void Clean() {
			FileUtil.DeleteFileOrDirectory("build");
		}
	
		[MenuItem("UnityBuildTool/Create Solution", false, 10001)]
		public static void CreateSolution() {
			EditorApplication.ExecuteMenuItem("Assets/Open C# Project");
		}
	}
}
`
}