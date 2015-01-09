//
//  TCViewController.h
//  TestChat
//
//  Created by Mike Lewis on 1/28/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>

#import "CXAlertView.h"
#import "JSONKit.h"
@interface TCViewController : UITableViewController<UITextFieldDelegate>

@property (nonatomic, retain) IBOutlet UITextView *inputView;
@property(nonatomic,strong)CXAlertView *createGroupChatAlertView;

@property(nonatomic,strong) NSString *userName;
@property(nonatomic,strong) NSString *targetName;
- (IBAction)reconnect:(id)sender;

@end
