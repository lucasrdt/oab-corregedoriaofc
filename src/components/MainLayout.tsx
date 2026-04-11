import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import Chatbot from "./Chatbot";
import PageTransition from "./PageTransition";
import { CardSkeleton } from "./SkeletonLoader";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        <PageTransition>
          {/* Wrapper com padding horizontal + vertical mínimo para páginas simples.
              Páginas com seções próprias (que definem container-padding internamente)
              não são prejudicadas pois o padding combinado fica consistente. */}
          <div className="container-padding py-8 md:py-10">
            <Suspense fallback={<LoadingFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </PageTransition>
      </main>

      <Footer />

      <WhatsAppButton />
      <Chatbot />
    </div>
  );
};

const LoadingFallback = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <CardSkeleton />
    <CardSkeleton />
    <CardSkeleton />
  </div>
);

export default MainLayout;
