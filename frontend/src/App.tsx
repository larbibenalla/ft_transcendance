import { Routes, Route } from "react-router-dom";

import {
  Overview,
  Settings,
  Game,
  Chat,
  Support,
  Login,
  NotFoundPage,
  PlayerProfile,
  ConversationContent,
  ChannelContent,
  ChatSplashScreen,
  Layout,
  PrefetchUsers,
  GameLayout,
  CheckOTP,
  AuthVerification,
  StayLoggedIn,
} from ".";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<StayLoggedIn />}>
        <Route index element={<Login />} />
      </Route>
      <Route element={<AuthVerification />}>
        <Route element={<PrefetchUsers />}>
          <Route element={<CheckOTP />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Overview />} />
              <Route path="profile/:username" element={<PlayerProfile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="game" element={<GameLayout />}>
                <Route index element={<Game />} />
              </Route>
              <Route path="chat" element={<Chat />}>
                <Route index element={<ChatSplashScreen />} />
                <Route
                  path="conversation/:id"
                  element={<ConversationContent />}
                />
                <Route
                  path="channel/:channelname"
                  element={<ChannelContent />}
                />
              </Route>
              <Route path="support" element={<Support />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

// TODO: set port 80 on the backend .env,  npm run build for nestjs
