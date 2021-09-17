import React from "react";
import Head from "next/head";
import SettingsTemplate from "src/templates/profile/settings";
import ProfileSettings from "src/templates/profile/settings/profileSettings";

export default function AccountProfilePage() {
	return (
		<>
			<Head>
				<title>Profile Settings • Posts</title>
				<meta name="description" content="Generated by create next app" />
			</Head>
			<SettingsTemplate>
				<ProfileSettings />
			</SettingsTemplate>
		</>
	);
}
