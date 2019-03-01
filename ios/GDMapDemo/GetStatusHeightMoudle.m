//
//  GetStatusHeightMoudle.m
//  GDMapDemo
//
//  Created by 石博 on 2019/2/28.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "GetStatusHeightMoudle.h"
#import <UIKit/UIKit.h>
#import <React/RCTLog.h>
@implementation GetStatusHeightMoudle
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD (getStatebarHeight:(RCTResponseSenderBlock)callback)
{
 CGRect rectStatus = [[UIApplication sharedApplication] statusBarFrame];
 NSString* height=[NSString stringWithFormat:@"%f",rectStatus.size.height];
callback(@[[NSNull null], height]);;
}
@end
