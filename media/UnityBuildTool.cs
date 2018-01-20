using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.NetworkInformation;
using UnityEditor;
using UnityEngine;

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

		private static void PerformBuild(string artifactName, string platform, bool developmentBuild) {
			var options = BuildOptions.None;
			if (developmentBuild) {
				options = options | BuildOptions.Development;
			}

			PlayerSettings.Android.keyaliasName = "";
			PlayerSettings.Android.keystoreName = "";

			EditorUserBuildSettings.development = developmentBuild;
			EditorUserBuildSettings.SwitchActiveBuildTarget(TargetGroups[platform], Targets[platform]);

			if (platform == "android") {
				artifactName = artifactName + ".apk";
			}
			if (platform == "windows") {
				artifactName = artifactName + ".exe";
			}

			BuildPipeline.BuildPlayer(GetScenePaths(), "build/" + platform + "/" + artifactName, Targets[platform], options);
		}

		public static void Perform() {
			if (!TargetGroups.ContainsKey(ReadPlatform()) || !Targets.ContainsKey(ReadPlatform())) {
				throw new Exception("Platform " + ReadPlatform() + " not supported");
			}
			else {
				PerformBuild(ReadArtifactName(), ReadPlatform(), ReadDevelopmentBuild());
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

		[MenuItem("UnityBuildTool/Build Mac", false, 101)]
		public static void BuildMac() {
			PerformBuild("standalone", "mac", true);
		}

		[MenuItem("UnityBuildTool/Build Windows", false, 101)]
		public static void BuildWindows() {
			PerformBuild("standalone", "windows", true);
		}

		[MenuItem("UnityBuildTool/Build WebGL", false, 101)]
		public static void BuildWebGL() {
			PerformBuild("web", "webgl", true);
		}

		[MenuItem("UnityBuildTool/Build iOS", false, 101)]
		public static void BuildIOS() {
			PerformBuild("iphone", "ios", true);
		}

		[MenuItem("UnityBuildTool/Build Android", false, 101)]
		public static void BuildAndroid() {
			PerformBuild("android", "android", true);
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