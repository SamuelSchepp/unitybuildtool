export class UnityBuildTool {
	public static Base64 = "dXNpbmcgU3lzdGVtOw0KdXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7DQp1c2luZyBTeXN0ZW0uRGlhZ25vc3RpY3M7DQp1c2luZyBTeXN0ZW0uTGlucTsNCnVzaW5nIFN5c3RlbS5OZXQuTmV0d29ya0luZm9ybWF0aW9uOw0KdXNpbmcgVW5pdHlFZGl0b3I7DQp1c2luZyBVbml0eUVuZ2luZTsNCg0KbmFtZXNwYWNlIEVkaXRvcg0Kew0KCXB1YmxpYyBzdGF0aWMgY2xhc3MgVW5pdHlCdWlsZFRvb2wgew0KDQoJCXByaXZhdGUgc3RhdGljIERpY3Rpb25hcnk8c3RyaW5nLCBCdWlsZFRhcmdldEdyb3VwPiBUYXJnZXRHcm91cHMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIEJ1aWxkVGFyZ2V0R3JvdXA+KCkgew0KCQkJeyJpb3MiLCBCdWlsZFRhcmdldEdyb3VwLmlPU30sDQoJCQl7ImFuZHJvaWQiLCBCdWlsZFRhcmdldEdyb3VwLkFuZHJvaWR9LA0KCQkJeyJ3aW5kb3dzIiwgQnVpbGRUYXJnZXRHcm91cC5TdGFuZGFsb25lfSwNCgkJCXsibWFjIiwgQnVpbGRUYXJnZXRHcm91cC5TdGFuZGFsb25lfSwNCgkJCXsid2ViZ2wiLCBCdWlsZFRhcmdldEdyb3VwLldlYkdMfQ0KCQl9Ow0KDQoJCXByaXZhdGUgc3RhdGljIERpY3Rpb25hcnk8c3RyaW5nLCBCdWlsZFRhcmdldD4gVGFyZ2V0cyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQnVpbGRUYXJnZXQ+KCkgew0KCQkJeyJpb3MiLCBCdWlsZFRhcmdldC5pT1N9LA0KCQkJeyJhbmRyb2lkIiwgQnVpbGRUYXJnZXQuQW5kcm9pZH0sDQoJCQl7IndpbmRvd3MiLCBCdWlsZFRhcmdldC5TdGFuZGFsb25lV2luZG93czY0fSwNCgkJCXsid2ViZ2wiLCBCdWlsZFRhcmdldC5XZWJHTH0sDQoJCQkjaWYgVU5JVFlfMjAxN18yIHx8IFVOSVRZXzIwMTdfMQ0KCQkJeyJtYWMiLCBCdWlsZFRhcmdldC5TdGFuZGFsb25lT1NYVW5pdmVyc2FsfQ0KCQkJI2Vsc2UNCgkJCXsibWFjIiwgQnVpbGRUYXJnZXQuU3RhbmRhbG9uZU9TWH0NCgkJCSNlbmRpZg0KCQl9Ow0KDQoJCXByaXZhdGUgc3RhdGljIHN0cmluZ1tdIEdldFNjZW5lUGF0aHMoKSB7DQoJCQlyZXR1cm4gRWRpdG9yQnVpbGRTZXR0aW5ncy5zY2VuZXMuU2VsZWN0KChzY2VuZSkgPT4gc2NlbmUucGF0aCkuVG9BcnJheSgpOw0KCQl9DQoNCgkJcHJpdmF0ZSBzdGF0aWMgdm9pZCBQZXJmb3JtQnVpbGQoc3RyaW5nIGFydGlmYWN0TmFtZSwgc3RyaW5nIHBsYXRmb3JtLCBib29sIGRldmVsb3BtZW50QnVpbGQpIHsNCgkJCXZhciBvcHRpb25zID0gQnVpbGRPcHRpb25zLk5vbmU7DQoJCQlpZiAoZGV2ZWxvcG1lbnRCdWlsZCkgew0KCQkJCW9wdGlvbnMgPSBvcHRpb25zIHwgQnVpbGRPcHRpb25zLkRldmVsb3BtZW50Ow0KCQkJfQ0KDQoJCQlQbGF5ZXJTZXR0aW5ncy5BbmRyb2lkLmtleWFsaWFzTmFtZSA9ICIiOw0KCQkJUGxheWVyU2V0dGluZ3MuQW5kcm9pZC5rZXlzdG9yZU5hbWUgPSAiIjsNCg0KCQkJRWRpdG9yVXNlckJ1aWxkU2V0dGluZ3MuZGV2ZWxvcG1lbnQgPSBkZXZlbG9wbWVudEJ1aWxkOw0KCQkJRWRpdG9yVXNlckJ1aWxkU2V0dGluZ3MuU3dpdGNoQWN0aXZlQnVpbGRUYXJnZXQoVGFyZ2V0R3JvdXBzW3BsYXRmb3JtXSwgVGFyZ2V0c1twbGF0Zm9ybV0pOw0KDQoJCQlpZiAocGxhdGZvcm0gPT0gImFuZHJvaWQiKSB7DQoJCQkJYXJ0aWZhY3ROYW1lID0gYXJ0aWZhY3ROYW1lICsgIi5hcGsiOw0KCQkJfQ0KCQkJaWYgKHBsYXRmb3JtID09ICJ3aW5kb3dzIikgew0KCQkJCWFydGlmYWN0TmFtZSA9IGFydGlmYWN0TmFtZSArICIuZXhlIjsNCgkJCX0NCg0KCQkJQnVpbGRQaXBlbGluZS5CdWlsZFBsYXllcihHZXRTY2VuZVBhdGhzKCksICJidWlsZC8iICsgcGxhdGZvcm0gKyAiLyIgKyBhcnRpZmFjdE5hbWUsIFRhcmdldHNbcGxhdGZvcm1dLCBvcHRpb25zKTsNCgkJfQ0KDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBQZXJmb3JtKCkgew0KCQkJaWYgKCFUYXJnZXRHcm91cHMuQ29udGFpbnNLZXkoUmVhZFBsYXRmb3JtKCkpIHx8ICFUYXJnZXRzLkNvbnRhaW5zS2V5KFJlYWRQbGF0Zm9ybSgpKSkgew0KCQkJCXRocm93IG5ldyBFeGNlcHRpb24oIlBsYXRmb3JtICIgKyBSZWFkUGxhdGZvcm0oKSArICIgbm90IHN1cHBvcnRlZCIpOw0KCQkJfQ0KCQkJZWxzZSB7DQoJCQkJUGVyZm9ybUJ1aWxkKFJlYWRBcnRpZmFjdE5hbWUoKSwgUmVhZFBsYXRmb3JtKCksIFJlYWREZXZlbG9wbWVudEJ1aWxkKCkpOw0KCQkJfQ0KCQl9DQoNCgkJcHJpdmF0ZSBzdGF0aWMgc3RyaW5nIFJlYWRQbGF0Zm9ybSgpIHsNCgkJCXZhciBhcmdzID0gRW52aXJvbm1lbnQuR2V0Q29tbWFuZExpbmVBcmdzKCk7DQoJCQlyZXR1cm4gYXJnc1thcmdzLkxlbmd0aCAtIDFdOw0KCQl9DQoNCgkJcHJpdmF0ZSBzdGF0aWMgYm9vbCBSZWFkRGV2ZWxvcG1lbnRCdWlsZCgpIHsNCgkJCXZhciBhcmdzID0gRW52aXJvbm1lbnQuR2V0Q29tbWFuZExpbmVBcmdzKCk7DQoJCQl2YXIgZGV2QnVpbGQgPSBhcmdzW2FyZ3MuTGVuZ3RoIC0gMl07DQoJCQlyZXR1cm4gZGV2QnVpbGQuRXF1YWxzKCJ0cnVlIik7DQoJCX0NCg0KCQlwcml2YXRlIHN0YXRpYyBzdHJpbmcgUmVhZEFydGlmYWN0TmFtZSgpIHsNCgkJCXZhciBhcmdzID0gRW52aXJvbm1lbnQuR2V0Q29tbWFuZExpbmVBcmdzKCk7DQoJCQlyZXR1cm4gYXJnc1thcmdzLkxlbmd0aCAtIDNdOw0KCQl9DQoNCgkJW01lbnVJdGVtKCJVbml0eUJ1aWxkVG9vbC9CdWlsZCBNYWMiLCBmYWxzZSwgMTAxKV0NCgkJcHVibGljIHN0YXRpYyB2b2lkIEJ1aWxkTWFjKCkgew0KCQkJUGVyZm9ybUJ1aWxkKCJzdGFuZGFsb25lIiwgIm1hYyIsIHRydWUpOw0KCQl9DQoNCgkJW01lbnVJdGVtKCJVbml0eUJ1aWxkVG9vbC9CdWlsZCBXaW5kb3dzIiwgZmFsc2UsIDEwMSldDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBCdWlsZFdpbmRvd3MoKSB7DQoJCQlQZXJmb3JtQnVpbGQoInN0YW5kYWxvbmUiLCAid2luZG93cyIsIHRydWUpOw0KCQl9DQoNCgkJW01lbnVJdGVtKCJVbml0eUJ1aWxkVG9vbC9CdWlsZCBXZWJHTCIsIGZhbHNlLCAxMDEpXQ0KCQlwdWJsaWMgc3RhdGljIHZvaWQgQnVpbGRXZWJHTCgpIHsNCgkJCVBlcmZvcm1CdWlsZCgid2ViIiwgIndlYmdsIiwgdHJ1ZSk7DQoJCX0NCg0KCQlbTWVudUl0ZW0oIlVuaXR5QnVpbGRUb29sL0J1aWxkIGlPUyIsIGZhbHNlLCAxMDEpXQ0KCQlwdWJsaWMgc3RhdGljIHZvaWQgQnVpbGRJT1MoKSB7DQoJCQlQZXJmb3JtQnVpbGQoImlwaG9uZSIsICJpb3MiLCB0cnVlKTsNCgkJfQ0KDQoJCVtNZW51SXRlbSgiVW5pdHlCdWlsZFRvb2wvQnVpbGQgQW5kcm9pZCIsIGZhbHNlLCAxMDEpXQ0KCQlwdWJsaWMgc3RhdGljIHZvaWQgQnVpbGRBbmRyb2lkKCkgew0KCQkJUGVyZm9ybUJ1aWxkKCJhbmRyb2lkIiwgImFuZHJvaWQiLCB0cnVlKTsNCgkJfQ0KDQoJCVtNZW51SXRlbSgiVW5pdHlCdWlsZFRvb2wvQ2xlYW4iLCBmYWxzZSwgMTAwMSldDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBDbGVhbigpIHsNCgkJCUZpbGVVdGlsLkRlbGV0ZUZpbGVPckRpcmVjdG9yeSgiYnVpbGQiKTsNCgkJfQ0KCQ0KCQlbTWVudUl0ZW0oIlVuaXR5QnVpbGRUb29sL0NyZWF0ZSBTb2x1dGlvbiIsIGZhbHNlLCAxMDAwMSldDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBDcmVhdGVTb2x1dGlvbigpIHsNCgkJCUVkaXRvckFwcGxpY2F0aW9uLkV4ZWN1dGVNZW51SXRlbSgiQXNzZXRzL09wZW4gQyMgUHJvamVjdCIpOw0KCQl9DQoJfQ0KfQ=="
}