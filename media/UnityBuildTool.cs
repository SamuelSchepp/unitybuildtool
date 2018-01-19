using System;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace Editor
{
	public static class UnityBuildTool {
		private static string ProjectName = "Racing Game Project";
	
		private static string[] GetScenePaths() {
			return EditorBuildSettings.scenes.Select((scene) => scene.path).ToArray();
		}

		private static bool TargetSupported(BuildTarget target) {
			try {
				var moduleManager = Type.GetType("UnityEditor.Modules.ModuleManager,UnityEditor.dll");
				if (moduleManager == null) {
					Debug.Log("UnityEditor.Modules.ModuleManager,UnityEditor.dll not found.");
					return true;
				}
				var isPlatformSupportLoaded = moduleManager.GetMethod("IsPlatformSupportLoaded", System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.NonPublic);
				if (isPlatformSupportLoaded == null) {
					Debug.Log("IsPlatformSupportLoaded not found.");
					return true;
				}
				var getTargetStringFromBuildTarget = moduleManager.GetMethod("GetTargetStringFromBuildTarget", System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.NonPublic);
				return (bool) isPlatformSupportLoaded.Invoke(null, new object[] {(string) getTargetStringFromBuildTarget.Invoke(null, new object[] {target})});
			} catch (Exception ex) {
				Debug.LogError(ex);
				return true;
			}
		}

		private static void PerformBuild(BuildTargetGroup group, BuildTarget target, string filename) {
			if (TargetSupported(target)) {
				EditorUserBuildSettings.development = true;
				EditorUserBuildSettings.SwitchActiveBuildTarget(group, target);
				BuildPipeline.BuildPlayer(GetScenePaths(), "build/" + target + "/" + filename, target, BuildOptions.None);
			} else {
				Debug.LogError("Support for target " + target + " is not installed.");
			}
		}

		[MenuItem("AutoBuild/Build All", false, 0)]
		public static void BuildAll() {
			Clean();
			BuildWindows();
			BuildMac();
			BuildLinux();
			BuildUwp();
			BuildWebGl();
		}
	
		[MenuItem("AutoBuild/Build Windows", false, 11)]
		public static void BuildWindows() {
			PerformBuild(BuildTargetGroup.Standalone, BuildTarget.StandaloneWindows64, ProjectName + ".exe");
		}
	
		[MenuItem("AutoBuild/Build Mac", false, 12)]
		public static void BuildMac() {
			PerformBuild(BuildTargetGroup.Standalone, BuildTarget.StandaloneOSX, ProjectName);
		}
	
		[MenuItem("AutoBuild/Build Linux", false, 13)]
		public static void BuildLinux() {
			PerformBuild(BuildTargetGroup.Standalone, BuildTarget.StandaloneLinux64, ProjectName);
		}
	
		[MenuItem("AutoBuild/Build UWP", false, 100)]
		public static void BuildUwp() {
			PerformBuild(BuildTargetGroup.WSA, BuildTarget.WSAPlayer, ProjectName);
		}
	
		[MenuItem("AutoBuild/Build WebGL", false, 101)]
		public static void BuildWebGl() {
			PerformBuild(BuildTargetGroup.WebGL, BuildTarget.WebGL, ProjectName);
		}

		[MenuItem("AutoBuild/Clean", false, 1001)]
		public static void Clean() {
			FileUtil.DeleteFileOrDirectory("build");
		}
	
		[MenuItem("AutoBuild/Create Solution", false, 10001)]
		public static void CreateSolution() {
			EditorApplication.ExecuteMenuItem("Assets/Open C# Project");
		}
	}
}