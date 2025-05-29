import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, Home } from "lucide-react";
import React from "react";


const InquiryHistory = () => { 
  return (
    <div className="w-[300px] h-[733px]">
      <Card className="fixed w-[302px] h-[733px] top-0 left-0 rounded-none">
        <CardContent className="relative w-[300px] h-[733px] p-0">
          {/* Background with overlay */}
          <div className="absolute w-full h-full top-0 left-0 bg-white bg-[url(/image.png)] bg-cover bg-[50%_50%]">
            <div className="h-full bg-white opacity-50" />
          </div>

          {/* Bottom inquiry button */}
          <div className="absolute w-full h-[31px] bottom-0 left-0 flex items-center justify-center">
            <span className="text-white text-[8px] [font-family:'Inter-Regular',Helvetica] font-normal">
              1:1문의하기
            </span>
          </div>

          {/* Header section */}
          <header className="absolute w-full h-[49px] top-0 left-0 overflow-hidden">
            <div className="flex flex-col">
              <div className="flex items-center justify-between px-3 pt-1.5">
                <ArrowLeft className="w-2 h-3.5" />
                <span className="text-black text-[8px] [font-family:'Inter-Regular',Helvetica] font-normal">
                  1:1문의내역
                </span>
                <Home className="w-6 h-[22px]" />
              </div>

              <div className="flex justify-between px-2 mt-1">
                <span className="text-black text-[8px] [font-family:'Inter-Regular',Helvetica] font-normal">
                  전체보기
                </span>
                <div className="flex items-center">
                  <span className="text-[#000000f2] text-[7px] [font-family:'Inter-Regular',Helvetica] font-normal mr-2">
                    전체 시기
                  </span>
                  <ChevronDown className="w-2 h-1.5" />
                </div>
              </div>
            </div>
          </header>

          {/* Empty state message */}
          <div className="absolute top-[387px] w-full flex justify-center">
            <span className="text-black text-[7px] [font-family:'Inter-Regular',Helvetica] font-normal">
              문의하신 내역이 없습니다.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InquiryHistory;