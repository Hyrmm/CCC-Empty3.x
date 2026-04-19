const json = {
    "generatedAt": "2026-04-19T21:30:10+08:00",
    "source": {
        "scene": "Assets/Scenes/Build_2_BugCatchingScene.unity",
        "bugPrefab": "Assets/GameObject/Bug.prefab",
        "bugDataFolder": "Assets/MonoBehaviour",
        "outputPurpose": "Bug animation and movement parameters for porting to Cocos Creator"
    },
    "enumMaps": {
        "movementType": {
            "0": "NORMAL",
            "1": "DASHER"
        },
        "heightLevel": {
            "0": "GROUNDED",
            "1": "CRAWLING",
            "2": "FLYING",
            "3": "SOARING"
        },
        "ease": {
            "0": "Unset",
            "1": "Linear",
            "2": "InSine",
            "3": "OutSine",
            "4": "InOutSine",
            "5": "InQuad",
            "6": "OutQuad",
            "7": "InOutQuad",
            "8": "InCubic",
            "9": "OutCubic",
            "10": "InOutCubic",
            "11": "InQuart",
            "12": "OutQuart",
            "13": "InOutQuart",
            "14": "InQuint",
            "15": "OutQuint",
            "16": "InOutQuint",
            "17": "InExpo",
            "18": "OutExpo",
            "19": "InOutExpo",
            "20": "InCirc",
            "21": "OutCirc",
            "22": "InOutCirc",
            "23": "InElastic",
            "24": "OutElastic",
            "25": "InOutElastic",
            "26": "InBack",
            "27": "OutBack",
            "28": "InOutBack",
            "29": "InBounce",
            "30": "OutBounce",
            "31": "InOutBounce",
            "32": "Flash",
            "33": "InFlash",
            "34": "OutFlash",
            "35": "InOutFlash",
            "36": "INTERNAL_Zero",
            "37": "INTERNAL_Custom"
        }
    },
    "sharedAnimation": {
        "visualModel": {
            "displayType": "Single Texture2D on BugQuad mesh",
            "prefabVisualNode": "BugQuad",
            "meshAsset": "Assets/Mesh/BugQuad.asset",
            "materialAsset": "Assets/Material/BugMat.mat",
            "runtimeTextureProperty": "_MainTex"
        },
        "prefabBase": {
            "scaleFactor": 1.3,
            "edgeBuffer": 0.8
        },
        "bounce": {
            "bounceScaleAmount": -0.275,
            "bounceScaleTime": 0.7,
            "bounceScaleElasticity": 1,
            "bounceScaleVibrato": 7,
            "minimumBounceAngle": 5,
            "skimmingBounceAdjustment": 0.25
        },
        "spawn": {
            "spawnSpeed": 0,
            "spawnAppearDuration": 0.25,
            "spawnAppearEase": {
                "value": 27,
                "name": "OutBack"
            },
            "spawnAppearOvershoot": 4.5,
            "spawnSpeedChangeTime": 1,
            "spawnSpeedChangeEase": {
                "value": 18,
                "name": "OutExpo"
            }
        },
        "catch": {
            "catchAnimationTime": 0.45,
            "catchMoveEase": {
                "value": 8,
                "name": "InCubic"
            },
            "catchStartScale": 1.6,
            "giganticCatchStartScale": 1.4,
            "catchScaleUpEase": {
                "value": 27,
                "name": "OutBack"
            },
            "catchScaleUpOvershoot": 9,
            "catchScaleUpTimeFraction": 0.4,
            "catchEndScale": 0.75,
            "catchScaleDownEase": {
                "value": 5,
                "name": "InQuad"
            },
            "catchScaleDownTimeFraction": 0.35,
            "catchMoveDelayVariation": 0.1
        },
        "special": {
            "gigantismScaleFactor": 1.75,
            "demoEndingScaleFactor": 1.25
        }
    },
    "implementationNotes": {
        "rootMotion": "Each frame: movePosition += moveDirection * currentSpeed * deltaTime",
        "directionChange": "While moving, moveDirection rotates by currentPathRotateAmount; new path duration is per-bug movementPathDurationRange",
        "facing": "visualTransform rotates toward -moveDirection, with visualTiltRange applied on the local right axis",
        "bounce": "On X/Z boundary hit, moveDirection is reflected, then visualTransform plays DOPunchScale using sharedAnimation.bounce values",
        "dasher": "If movementType is DASHER, bug waits dashRechargeDuration, then plays a jump/scale tween across currentPathDuration",
        "heightPlacement": "Spawn height depends on heightLevel enum and BugData.GetRandomHeight() buckets",
        "shaderNote": "BugData wiggle parameters are exported because Bug.cs sends them to material properties, but the current exported BugShader.shader only samples _MainTex and does not visibly deform the quad."
    },
    "bugs": [
        {
            "bugID": -1,
            "bugName": "Debug Space Bug",
            "assetName": "BugData_34_DebugSpaceBug",
            "assetPath": "Assets/MonoBehaviour/BugData_34_DebugSpaceBug.asset",
            "isSkillTreeBug": false,
            "isDebugBug": true,
            "visual": {
                "baseScale": 1.1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 3,
                    "name": "SOARING"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 22,
                "wiggleAmount": 0.35,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 0,
            "bugName": "Cosmic Scarab",
            "assetName": "BugData_0_SkillTreeBug",
            "assetPath": "Assets/MonoBehaviour/BugData_0_SkillTreeBug.asset",
            "isSkillTreeBug": true,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0,
                "heightLevel": {
                    "value": 3,
                    "name": "SOARING"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 7,
                "wiggleAmount": 0.35,
                "holdTiltDuration": 0,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 5,
                "turnSpeedRange": {
                    "x": -1,
                    "y": -1
                },
                "turnConstantlyWhileMoving": false,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 1,
            "bugName": "Ladybug",
            "assetName": "BugData_1_1_Ladybug",
            "assetPath": "Assets/MonoBehaviour/BugData_1_1_Ladybug.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 0.65,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 22,
                "wiggleAmount": 0.35,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 0.75,
                "turnSpeedRange": {
                    "x": 10,
                    "y": 80
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 2,
            "bugName": "Grasshopper",
            "assetName": "BugData_1_2_Grasshopper",
            "assetPath": "Assets/MonoBehaviour/BugData_1_2_Grasshopper.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1.2,
                "scaleVariation": 0.1,
                "heightLevel": {
                    "value": 1,
                    "name": "CRAWLING"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 12,
                "wiggleAmount": 0.3,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 1,
                    "name": "DASHER"
                },
                "moveSpeed": 10,
                "turnSpeedRange": {
                    "x": 30,
                    "y": 60
                },
                "turnConstantlyWhileMoving": false,
                "pivotOnNewPath": true,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 0.3
                },
                "visualTurnSmoothing": 3
            },
            "dash": {
                "dashRechargeDuration": 1,
                "dashHeightRaiseAmount": 4,
                "dashScaleAmount": 1.4,
                "dashHeightRaiseEase": {
                    "value": 7,
                    "name": "InOutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 7,
                    "name": "InOutQuad"
                }
            }
        },
        {
            "bugID": 3,
            "bugName": "Morpho Butterfly",
            "assetName": "BugData_1_3_BlueMorphoButterfly",
            "assetPath": "Assets/MonoBehaviour/BugData_1_3_BlueMorphoButterfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1.2,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.75,
                "turnSpeedRange": {
                    "x": 75,
                    "y": 120
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": true,
                "movementPathDurationRange": {
                    "x": 1.25,
                    "y": 1.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 4,
            "bugName": "Monarch Butterfly",
            "assetName": "BugData_2_1_MonarchButterfly",
            "assetPath": "Assets/MonoBehaviour/BugData_2_1_MonarchButterfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.3,
                "turnSpeedRange": {
                    "x": 75,
                    "y": 120
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1.25,
                    "y": 1.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 5,
            "bugName": "Tiger Butterfly",
            "assetName": "BugData_2_2_TigerButterfly",
            "assetPath": "Assets/MonoBehaviour/BugData_2_2_TigerButterfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.3,
                "turnSpeedRange": {
                    "x": 75,
                    "y": 120
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1.25,
                    "y": 1.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 6,
            "bugName": "Agrias Butterfly",
            "assetName": "BugData_2_3_AgriasButterfly",
            "assetPath": "Assets/MonoBehaviour/BugData_2_3_AgriasButterfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.3,
                "turnSpeedRange": {
                    "x": 75,
                    "y": 120
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1.25,
                    "y": 1.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 7,
            "bugName": "Bee Fly",
            "assetName": "BugData_3_1_BeeFly",
            "assetPath": "Assets/MonoBehaviour/BugData_3_1_BeeFly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 0.95,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 45,
                "wiggleAmount": 1.45,
                "holdTiltDuration": 0.2,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 2.75,
                "turnSpeedRange": {
                    "x": 15,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": true,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.35,
                    "y": 0.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 8,
            "bugName": "Honeybee",
            "assetName": "BugData_3_1_Honeybee",
            "assetPath": "Assets/MonoBehaviour/BugData_3_1_Honeybee.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 0.85,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 45,
                "wiggleAmount": 1.45,
                "holdTiltDuration": 0.2,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 2.25,
                "turnSpeedRange": {
                    "x": 15,
                    "y": 60
                },
                "turnConstantlyWhileMoving": false,
                "pivotOnNewPath": true,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.35,
                    "y": 0.5
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 9,
            "bugName": "Cabbage White",
            "assetName": "BugData_3_2_CabbageWhiteButterfly",
            "assetPath": "Assets/MonoBehaviour/BugData_3_2_CabbageWhiteButterfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1.1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 3,
                    "name": "SOARING"
                },
                "visualTiltRange": {
                    "x": 5,
                    "y": 15
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.8,
                "turnSpeedRange": {
                    "x": 80,
                    "y": 100
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": true,
                "movementPathDurationRange": {
                    "x": 1.5,
                    "y": 1.8
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 10,
            "bugName": "Giant Mantis",
            "assetName": "BugData_3_3_GiantMantis",
            "assetPath": "Assets/MonoBehaviour/BugData_3_3_GiantMantis.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1.3,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 18,
                "wiggleAmount": 0.4,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.1,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 11,
            "bugName": "Blue Damselfly",
            "assetName": "BugData_4_1_BlueDamselfly",
            "assetPath": "Assets/MonoBehaviour/BugData_4_1_BlueDamselfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 45,
                "wiggleAmount": 1.45,
                "holdTiltDuration": 0.2,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 12,
            "bugName": "Common Bluebottle",
            "assetName": "BugData_4_1_CommonBluebottleButterfly",
            "assetPath": "Assets/MonoBehaviour/BugData_4_1_CommonBluebottleButterfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.3,
                "turnSpeedRange": {
                    "x": 75,
                    "y": 120
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1.25,
                    "y": 1.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 13,
            "bugName": "Blue Mint Beetle",
            "assetName": "BugData_4_2_BlueMintBeetle",
            "assetPath": "Assets/MonoBehaviour/BugData_4_2_BlueMintBeetle.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 22,
                "wiggleAmount": 0.35,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 14,
            "bugName": "Golden-ringed Dragonfly",
            "assetName": "BugData_4_3_GoldenRingedDragonfly",
            "assetPath": "Assets/MonoBehaviour/BugData_4_3_GoldenRingedDragonfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 45,
                "wiggleAmount": 1.45,
                "holdTiltDuration": 0.2,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 15,
            "bugName": "Rhino Beetle",
            "assetName": "BugData_5_1_RhinoBeetle",
            "assetPath": "Assets/MonoBehaviour/BugData_5_1_RhinoBeetle.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 22,
                "wiggleAmount": 0.35,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 16,
            "bugName": "Giraffe Stag",
            "assetName": "BugData_5_2_GiraffeStag",
            "assetPath": "Assets/MonoBehaviour/BugData_5_2_GiraffeStag.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 22,
                "wiggleAmount": 0.35,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 17,
            "bugName": "Hercules Beetle",
            "assetName": "BugData_5_2_HerculesBeetle",
            "assetPath": "Assets/MonoBehaviour/BugData_5_2_HerculesBeetle.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 22,
                "wiggleAmount": 0.35,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 18,
            "bugName": "Goliath Beetle",
            "assetName": "BugData_5_3_GoliathBeetle",
            "assetPath": "Assets/MonoBehaviour/BugData_5_3_GoliathBeetle.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 22,
                "wiggleAmount": 0.35,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 19,
            "bugName": "Creamy Marblewing",
            "assetName": "BugData_6_1_CreamyMarblewing",
            "assetPath": "Assets/MonoBehaviour/BugData_6_1_CreamyMarblewing.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1.05,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 3,
                    "name": "SOARING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 2.5,
                "turnSpeedRange": {
                    "x": 75,
                    "y": 120
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": true,
                "movementPathDurationRange": {
                    "x": 1.25,
                    "y": 1.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 20,
            "bugName": "Leaf Insect",
            "assetName": "BugData_6_1_LeafInsect",
            "assetPath": "Assets/MonoBehaviour/BugData_6_1_LeafInsect.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1.1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 22,
                "wiggleAmount": 0.4,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.1,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 21,
            "bugName": "Hummingbird Moth",
            "assetName": "BugData_6_2_HummingbirdMoth",
            "assetPath": "Assets/MonoBehaviour/BugData_6_2_HummingbirdMoth.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1.05,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 65,
                "wiggleAmount": 1.4,
                "holdTiltDuration": 0.2,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 2.5,
                "turnSpeedRange": {
                    "x": 15,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": true,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.25,
                    "y": 0.5
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 22,
            "bugName": "Stick Insect",
            "assetName": "BugData_6_2_StickInsect",
            "assetPath": "Assets/MonoBehaviour/BugData_6_2_StickInsect.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1.25,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 14,
                "wiggleAmount": 0.3,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 0.5,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 23,
            "bugName": "Orchid Mantis",
            "assetName": "BugData_6_3_OrchidMantis",
            "assetPath": "Assets/MonoBehaviour/BugData_6_3_OrchidMantis.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1.15,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 1,
                    "name": "CRAWLING"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 12,
                "wiggleAmount": 0.3,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 1,
                    "name": "DASHER"
                },
                "moveSpeed": 9,
                "turnSpeedRange": {
                    "x": 30,
                    "y": 60
                },
                "turnConstantlyWhileMoving": false,
                "pivotOnNewPath": true,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.3,
                    "y": 0.5
                },
                "visualTurnSmoothing": 3
            },
            "dash": {
                "dashRechargeDuration": 1,
                "dashHeightRaiseAmount": 3,
                "dashScaleAmount": 1.2,
                "dashHeightRaiseEase": {
                    "value": 7,
                    "name": "InOutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 7,
                    "name": "InOutQuad"
                }
            }
        },
        {
            "bugID": 24,
            "bugName": "Apollo Butterfly",
            "assetName": "BugData_7_1_ApolloButterfly",
            "assetPath": "Assets/MonoBehaviour/BugData_7_1_ApolloButterfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.3,
                "turnSpeedRange": {
                    "x": 75,
                    "y": 120
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1.25,
                    "y": 1.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 25,
            "bugName": "Green-celled Cattleheart",
            "assetName": "BugData_7_2_GreenCelledCattleheart",
            "assetPath": "Assets/MonoBehaviour/BugData_7_2_GreenCelledCattleheart.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 26,
            "bugName": "Peacock Butterfly",
            "assetName": "BugData_7_2_PeacockButterfly",
            "assetPath": "Assets/MonoBehaviour/BugData_7_2_PeacockButterfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.3,
                "turnSpeedRange": {
                    "x": 75,
                    "y": 120
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1.25,
                    "y": 1.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 27,
            "bugName": "Great Purple Emperor",
            "assetName": "BugData_7_3_GreatPurpleEmperor",
            "assetPath": "Assets/MonoBehaviour/BugData_7_3_GreatPurpleEmperor.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 28,
            "bugName": "Pipevine Swallowtail",
            "assetName": "BugData_7_3_PipevineSwallowtail",
            "assetPath": "Assets/MonoBehaviour/BugData_7_3_PipevineSwallowtail.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 29,
            "bugName": "Blue Ghost Firefly",
            "assetName": "BugData_8_1_BlueGhostFirefly",
            "assetPath": "Assets/MonoBehaviour/BugData_8_1_BlueGhostFirefly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 45,
                "wiggleAmount": 1.45,
                "holdTiltDuration": 0.2,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 30,
            "bugName": "Common Firefly",
            "assetName": "BugData_8_1_CommonFirefly",
            "assetPath": "Assets/MonoBehaviour/BugData_8_1_CommonFirefly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 45,
                "wiggleAmount": 1.45,
                "holdTiltDuration": 0.2,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 31,
            "bugName": "Blue Moon Butterfly",
            "assetName": "BugData_8_2_BlueMoonButterfly",
            "assetPath": "Assets/MonoBehaviour/BugData_8_2_BlueMoonButterfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.3,
                "turnSpeedRange": {
                    "x": 75,
                    "y": 120
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1.25,
                    "y": 1.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 32,
            "bugName": "Rosy Maple Moth",
            "assetName": "BugData_8_2_RosyMapleMoth",
            "assetPath": "Assets/MonoBehaviour/BugData_8_2_RosyMapleMoth.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 33,
            "bugName": "Luna Moth",
            "assetName": "BugData_8_3_LunaMoth",
            "assetPath": "Assets/MonoBehaviour/BugData_8_3_LunaMoth.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 34,
            "bugName": "Clearspot Bluewing",
            "assetName": "BugData_9_1_ClearspotBluewing",
            "assetPath": "Assets/MonoBehaviour/BugData_9_1_ClearspotBluewing.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 35,
            "bugName": "Malachite Butterfly",
            "assetName": "BugData_9_1_MalachiteButterfly",
            "assetPath": "Assets/MonoBehaviour/BugData_9_1_MalachiteButterfly.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.3,
                "turnSpeedRange": {
                    "x": 75,
                    "y": 120
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1.25,
                    "y": 1.75
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 36,
            "bugName": "Jewel Beetle",
            "assetName": "BugData_9_2_JewelBeetle",
            "assetPath": "Assets/MonoBehaviour/BugData_9_2_JewelBeetle.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 22,
                "wiggleAmount": 0.35,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 37,
            "bugName": "Rainbow Stag Beetle",
            "assetName": "BugData_9_2_RainbowStag",
            "assetPath": "Assets/MonoBehaviour/BugData_9_2_RainbowStag.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 0,
                    "name": "GROUNDED"
                },
                "visualTiltRange": {
                    "x": 0,
                    "y": 0
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 22,
                "wiggleAmount": 0.35,
                "holdTiltDuration": 0.25,
                "movementExtents": {
                    "x": -1,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "mirrorWiggle": false
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 0,
                    "y": 60
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 1,
                    "y": 2
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        },
        {
            "bugID": 38,
            "bugName": "Madagascan Sunset Moth",
            "assetName": "BugData_9_3_MadagascanSunsetMoth",
            "assetPath": "Assets/MonoBehaviour/BugData_9_3_MadagascanSunsetMoth.asset",
            "isSkillTreeBug": false,
            "isDebugBug": false,
            "visual": {
                "baseScale": 1,
                "scaleVariation": 0.125,
                "heightLevel": {
                    "value": 2,
                    "name": "FLYING"
                },
                "visualTiltRange": {
                    "x": 10,
                    "y": 25
                }
            },
            "shaderWiggle": {
                "wiggleSpeed": 19,
                "wiggleAmount": 1.6,
                "holdTiltDuration": 0.05,
                "movementExtents": {
                    "x": 0.3,
                    "y": 1
                },
                "wiggleAxis": {
                    "x": 0,
                    "y": 0,
                    "z": 1
                },
                "mirrorWiggle": true
            },
            "movement": {
                "movementType": {
                    "value": 0,
                    "name": "NORMAL"
                },
                "moveSpeed": 1.5,
                "turnSpeedRange": {
                    "x": 100,
                    "y": 140
                },
                "turnConstantlyWhileMoving": true,
                "pivotOnNewPath": false,
                "alternateTurnDirection": false,
                "movementPathDurationRange": {
                    "x": 0.15,
                    "y": 1
                },
                "visualTurnSmoothing": 50
            },
            "dash": {
                "dashRechargeDuration": 0.25,
                "dashHeightRaiseAmount": 2,
                "dashScaleAmount": 1.25,
                "dashHeightRaiseEase": {
                    "value": 6,
                    "name": "OutQuad"
                },
                "dashHeightLowerEase": {
                    "value": 30,
                    "name": "OutBounce"
                }
            }
        }
    ]
}

export const BugConfigs = json;