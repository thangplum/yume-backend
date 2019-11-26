'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">yume-firefly documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-19dc787d9f9c9c0080c1de6d7783c163"' : 'data-target="#xs-controllers-links-module-AppModule-19dc787d9f9c9c0080c1de6d7783c163"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-19dc787d9f9c9c0080c1de6d7783c163"' :
                                            'id="xs-controllers-links-module-AppModule-19dc787d9f9c9c0080c1de6d7783c163"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-19dc787d9f9c9c0080c1de6d7783c163"' : 'data-target="#xs-injectables-links-module-AppModule-19dc787d9f9c9c0080c1de6d7783c163"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-19dc787d9f9c9c0080c1de6d7783c163"' :
                                        'id="xs-injectables-links-module-AppModule-19dc787d9f9c9c0080c1de6d7783c163"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-25f23df55ee31d81707e9186c1b7b386"' : 'data-target="#xs-injectables-links-module-AuthModule-25f23df55ee31d81707e9186c1b7b386"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-25f23df55ee31d81707e9186c1b7b386"' :
                                        'id="xs-injectables-links-module-AuthModule-25f23df55ee31d81707e9186c1b7b386"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CategoryModule.html" data-type="entity-link">CategoryModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CategoryModule-4d6b9facca037fd7d6a6b4dd4c3b1781"' : 'data-target="#xs-injectables-links-module-CategoryModule-4d6b9facca037fd7d6a6b4dd4c3b1781"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CategoryModule-4d6b9facca037fd7d6a6b4dd4c3b1781"' :
                                        'id="xs-injectables-links-module-CategoryModule-4d6b9facca037fd7d6a6b4dd4c3b1781"' }>
                                        <li class="link">
                                            <a href="injectables/CategoryService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CategoryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PostService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PostService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommentModule.html" data-type="entity-link">CommentModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CommentModule-b3fcc0ab67fbf726c2f59c8fa9227c77"' : 'data-target="#xs-injectables-links-module-CommentModule-b3fcc0ab67fbf726c2f59c8fa9227c77"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommentModule-b3fcc0ab67fbf726c2f59c8fa9227c77"' :
                                        'id="xs-injectables-links-module-CommentModule-b3fcc0ab67fbf726c2f59c8fa9227c77"' }>
                                        <li class="link">
                                            <a href="injectables/CommentService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CommentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigModule.html" data-type="entity-link">ConfigModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PostModule.html" data-type="entity-link">PostModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-PostModule-e72334a70a5cd73e1b60f63d6186b024"' : 'data-target="#xs-controllers-links-module-PostModule-e72334a70a5cd73e1b60f63d6186b024"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PostModule-e72334a70a5cd73e1b60f63d6186b024"' :
                                            'id="xs-controllers-links-module-PostModule-e72334a70a5cd73e1b60f63d6186b024"' }>
                                            <li class="link">
                                                <a href="controllers/PostController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PostController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PostModule-e72334a70a5cd73e1b60f63d6186b024"' : 'data-target="#xs-injectables-links-module-PostModule-e72334a70a5cd73e1b60f63d6186b024"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PostModule-e72334a70a5cd73e1b60f63d6186b024"' :
                                        'id="xs-injectables-links-module-PostModule-e72334a70a5cd73e1b60f63d6186b024"' }>
                                        <li class="link">
                                            <a href="injectables/PostService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PostService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReplyService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ReplyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReplyModule.html" data-type="entity-link">ReplyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ReplyModule-1f91c391f5a7a610a0b105460f38ba27"' : 'data-target="#xs-controllers-links-module-ReplyModule-1f91c391f5a7a610a0b105460f38ba27"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReplyModule-1f91c391f5a7a610a0b105460f38ba27"' :
                                            'id="xs-controllers-links-module-ReplyModule-1f91c391f5a7a610a0b105460f38ba27"' }>
                                            <li class="link">
                                                <a href="controllers/ReplyController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReplyController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ReplyModule-1f91c391f5a7a610a0b105460f38ba27"' : 'data-target="#xs-injectables-links-module-ReplyModule-1f91c391f5a7a610a0b105460f38ba27"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReplyModule-1f91c391f5a7a610a0b105460f38ba27"' :
                                        'id="xs-injectables-links-module-ReplyModule-1f91c391f5a7a610a0b105460f38ba27"' }>
                                        <li class="link">
                                            <a href="injectables/CommentService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CommentService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReplyService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ReplyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-6ad09760fe0a071c2b10489f239afcc8"' : 'data-target="#xs-controllers-links-module-UserModule-6ad09760fe0a071c2b10489f239afcc8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-6ad09760fe0a071c2b10489f239afcc8"' :
                                            'id="xs-controllers-links-module-UserModule-6ad09760fe0a071c2b10489f239afcc8"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-6ad09760fe0a071c2b10489f239afcc8"' : 'data-target="#xs-injectables-links-module-UserModule-6ad09760fe0a071c2b10489f239afcc8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-6ad09760fe0a071c2b10489f239afcc8"' :
                                        'id="xs-injectables-links-module-UserModule-6ad09760fe0a071c2b10489f239afcc8"' }>
                                        <li class="link">
                                            <a href="injectables/ReplyService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ReplyService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CategoryDTO.html" data-type="entity-link">CategoryDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryEntity.html" data-type="entity-link">CategoryEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryResolver.html" data-type="entity-link">CategoryResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentDTO.html" data-type="entity-link">CommentDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentEntity.html" data-type="entity-link">CommentEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentResolver.html" data-type="entity-link">CommentResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigService.html" data-type="entity-link">ConfigService</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpErrorFilter.html" data-type="entity-link">HttpErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/PostDTO.html" data-type="entity-link">PostDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/PostEntity.html" data-type="entity-link">PostEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/PostResolver.html" data-type="entity-link">PostResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/PostResponseDTO.html" data-type="entity-link">PostResponseDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReplyDTO.html" data-type="entity-link">ReplyDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReplyEntity.html" data-type="entity-link">ReplyEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReplyResolver.html" data-type="entity-link">ReplyResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEntity.html" data-type="entity-link">UserEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserLoginDTO.html" data-type="entity-link">UserLoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRegisterDTO.html" data-type="entity-link">UserRegisterDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResolver.html" data-type="entity-link">UserResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResponseDTO.html" data-type="entity-link">UserResponseDTO</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/GqlAuthGuard.html" data-type="entity-link">GqlAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoggingInterceptor.html" data-type="entity-link">LoggingInterceptor</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});