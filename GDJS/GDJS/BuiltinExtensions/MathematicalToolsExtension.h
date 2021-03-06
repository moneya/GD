/*
 * GDevelop JS Platform
 * Copyright 2008-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */
#ifndef MATHEMATICALTOOLSEXTENSION_H
#define MATHEMATICALTOOLSEXTENSION_H
#include "GDCore/PlatformDefinition/PlatformExtension.h"

namespace gdjs
{

/**
 * \brief Built-in extension providing common functions.
 *
 * \ingroup BuiltinExtensions
 */
class MathematicalToolsExtension: public gd::PlatformExtension
{
public :

    MathematicalToolsExtension();
    virtual ~MathematicalToolsExtension() {};
};

}
#endif // MATHEMATICALTOOLSEXTENSION_H
